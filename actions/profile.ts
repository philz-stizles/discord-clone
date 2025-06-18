import { currentUser, redirectToSignIn, auth } from '@clerk/nextjs';
import { prismaClient } from '@/lib/prisma';

export const getProfile = async () => {
  let profile = null;

  try {
    const user = await currentUser();

    console.log('user: ', user)

    if (!user) {
      return redirectToSignIn();
    }

    profile = await prismaClient.profile.findUnique({
      where: { userId: user.id },
    });

    if (profile) {
      return profile;
    }

    profile = await prismaClient.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });
  } catch (error: any) {
    console.log(error.message);
  }

  return profile;
};

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await prismaClient.profile.findUnique({
    where: { userId },
  });

  return profile;
};

// export const currentProfilePages = async (req: NextApiRequest) => {
//   const { userId } = getAuth(req);

//   if (!userId) {
//     return null;
//   }

//   const profile = await prismaClient.profile.findUnique({
//     where: {
//       userId,
//     },
//   });

//   return profile;
// };
