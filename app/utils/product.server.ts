import { db } from "./prisma.server";

export const getAllProductNames = async () => {
    try {
      const products = await db.productCategory.findMany();
      console.log("Fetched products:", products);
      const productNames = products.map((product) => product.name);
      return productNames;
    } catch (error) {
      console.error("Error fetching product names:", error);
      throw error;
    }
  };

  export const getAllProductID = async () => {
    try {
      const products = await db.productCategory.findMany();
      console.log("Fetched products:", products);
      const productNames = products.map((product) => product.id);
      return productNames;
    } catch (error) {
      console.error("Error fetching product names:", error);
      throw error;
    }
  };
  
  export const createNewProduct = async (name: string, categoryId: string, imageUrl:string) => {
    try {
      console.log("Creating new product:", name, categoryId);
  
      const createdProduct = await db.product.create({
        data: {
          name,
          category: { connect: { id: categoryId } },
          image: imageUrl
        },
      });
  
      console.log("Product created:", createdProduct);
  
      return createdProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };