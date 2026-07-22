import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, uploadVideo } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { canManageMedia } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError, ValidationError } from '@/lib/errors';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    if (!canManageMedia(userRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const userId = (session.user as any).id;

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      throw new ValidationError('No file provided');
    }

    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const fileSize = file.size;

    if (fileSize > MAX_FILE_SIZE) {
      throw new ValidationError('File size exceeds 50MB limit');
    }

    if (!type || !['IMAGE', 'VIDEO'].includes(type)) {
      throw new ValidationError('Invalid media type');
    }

    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    
    const fileType = file.type;

    if (type === 'IMAGE' && !allowedImageTypes.includes(fileType)) {
      throw new ValidationError('Invalid image format. Allowed: JPEG, PNG, WebP, GIF');
    }

    if (type === 'VIDEO' && !allowedVideoTypes.includes(fileType)) {
      throw new ValidationError('Invalid video format. Allowed: MP4, WebM, MOV');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let uploadResult;
    if (type === 'IMAGE') {
      uploadResult = await uploadImage(buffer);
    } else {
      uploadResult = await uploadVideo(buffer);
    }

    const media = await prisma.media.create({
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        type: type as any,
        uploadedById: userId,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
