import { db } from "./prisma.server";

export const createProductCategory = async (name: string,imageUrl: string) => {
  console.log("Trying to create product category")
  try {
    await db.productCategory.create({
      data: {
        name,
        image: imageUrl
      },
    });
    console.log("This is the image url: " + imageUrl)
  } catch (error) {
    console.error("Error creating product category:", error);
    throw error;
  }
};


export const getProductCategoryId = async (name: string) => {
    try {
      const category = await db.productCategory.findFirst({
        where: {
          name: name,
        },
      });
  
      if (category) {
        return category.id;
      } else {
        console.error("Category not found:", name);
        return null;
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  };
  