import { db } from "./prisma.server";

export const getAllCategoryAndID = async () => {
    try {
      const categories = await db.productCategory.findMany();
  
      console.log("Fetched products:", categories);
  
      const combinedCategories = categories.map((category) => ({
        name: category.name,
        id: category.id,
      }));
  
      return combinedCategories;
    } catch (error) {
      console.error("Error fetching product names:", error);
  
      throw error;
    }
  };

  export const deleteProductCategory = async (categoryId: any) => {
    try {
      const products = await db.product.findMany({
        where: {
          category_id: categoryId,
        },
      });
  
      for (const product of products) {
        await db.productDescription.deleteMany({
          where: {
            product_id: product.id,
          },
        });
      }
  
      await db.product.deleteMany({
        where: {
          category_id: categoryId,
        },
      });
  
      await db.productCategory.delete({
        where: {
          id: categoryId,
        },
      });
  
      console.log(`Product Category with ID ${categoryId} and related records deleted.`);
    } catch (error) {
      console.error('Error deleting product category and related records:', error);
    }
  };