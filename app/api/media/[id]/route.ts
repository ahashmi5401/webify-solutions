import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteImage, deleteVideo } from '@/lib/cloudinary';
import { requireEditorOrAbove } from '@/lib/rbac';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { handleApiError, ForbiddenError, NotFoundError } from '@/lib/errors';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = (session.user as any).role;
    requireEditorOrAbove(userRole);

    const { id } = await params;

    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundError('Media not found');
    }

    // Delete from Cloudinary
    try {
      if (media.type === 'IMAGE') {
        await deleteImage(media.publicId);
      } else if (media.type === 'VIDEO') {
        await deleteVideo(media.publicId);
      }
    } catch (cloudinaryError) {
      // Log but continue with DB deletion to avoid orphaned records
      console.error('Failed to delete from Cloudinary:', cloudinaryError);
    }

    // Delete from database
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Media deleted successfully' });
  } catch (error) {
    const errorResponse = handleApiError(error);
    return NextResponse.json(errorResponse, { status: errorResponse.error.statusCode });
  }
}
