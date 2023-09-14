import { db } from "./prisma.server";

export const getAllProductAndID = async () => {
    try {
      const products = await db.product.findMany();
  
      console.log("Fetched products:", products);
  
      const combinedCategories = products.map((product) => ({
        name: product.name,
        id: product.id,
      }));
  
      return combinedCategories;
    } catch (error) {
      console.error("Error fetching product names:", error);
  
      throw error;
    }
  };

  export const deleteProduct = async (productId: string) => {
    try {
      await db.productDescription.deleteMany({
        where: {
          product_id: productId,
        },
      });
  
      await db.product.delete({
        where: {
          id: productId,
        },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };
  
  