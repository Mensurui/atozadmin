import { db } from "~/utils/prisma.server";

export const deleteProductDescription = async (descriptionId: string) => {
  try {
    await db.productDescription.delete({
      where: {
        id: descriptionId,
      },
    });
  } catch (error) {
    console.error("Error deleting product description:", error);
    throw error;
  }
};
