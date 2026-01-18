import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../lib/postgres-database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await userService.getByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone, image } = await request.json();

    const user = await userService.getByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const updatedUser = await userService.update(user.id, {
      name: name || undefined,
      phone: phone || undefined,
      image: image || undefined,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Failed to update profile' },
        { status: 500 },
      );
    }

    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
