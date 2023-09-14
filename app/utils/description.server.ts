import { db } from "./prisma.server";

export const getProductsByCategory =async (categoryId:string) => {
  await db.product.findMany({
    where: {
       category_id: categoryId}
  })
}

export const getProductId = async(name: string) => {
  const pName = await db.product.findFirst({
    where: {name:name}
  })
  return pName
  }

export const createProductDescription = async (
  descriptionText: string,
  descriptionPercentage: string,
  productId: string
) => {
  try {
await db.productDescription.create({
      data: {
        description_text: descriptionText,
        description_percentage: descriptionPercentage,
        product: { connect: { id: productId } },
      },
    });
  } catch (error) {
    console.error("Error creating product description:", error);
    throw error;
  }
};


// export const removeDescription = async (descriptionId: string) => {
//   await db.productCategory.delete({
//     where:{
//       id: descriptionId
//     }
//   })
// }
