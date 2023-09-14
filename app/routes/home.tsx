import { Outlet, useNavigate } from "@remix-run/react";
import { Layout } from "~/components/layout";

export default function Home() {
  const navigate = useNavigate();

  const buttonStyles =
    "bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 text-white py-3 px-6 rounded-full transition duration-300 hover:bg-blue-800 hover:scale-105";

  return (
    <Layout>
        <Outlet/>
      <div className="flex flex-col lg:flex-row gap-6 ml-80">
        <div className="lg:w-2/3">
          <h1 className="text-center text-4xl font-semibold text-blue-900 mb-8">
            Admin Panel
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="py-3 e rounded-lg shadow-md">
              <button
                className={`${buttonStyles}`}
                onClick={() => navigate(`newProductCategory`)}
              >
                Add New Product Category
              </button>
            </div>
            <div className="py-3  rounded-lg shadow-md">
              <button
                className={`${buttonStyles}`}
                onClick={() => navigate(`newProductList`)}
              >
                Add New Product Item
              </button>
            </div>
            <div className="py-3  rounded-lg shadow-md">
              <button
                className={`${buttonStyles}`}
                onClick={() => navigate(`newDescription`)}
              >
                Add New Description
              </button>
            </div>
            <div className="py-3  rounded-lg shadow-md">
              <button
                className={`${buttonStyles}`}
                onClick={() => navigate(`removeCategory`)}
              >
                Remove Product Category
              </button>
            </div>
            <div className="py-3  rounded-lg shadow-md">
              <button
                className={`${buttonStyles}`}
                onClick={() => navigate(`removeProduct`)}
              >
                Remove Product Item
              </button>
            </div>
            <div className="py-3  rounded-lg shadow-md">
              <button
                className={`${buttonStyles}`}
                onClick={() => navigate(`removeDescription`)}
              >
                Remove Description
              </button>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3">
        </div>
      </div>
    </Layout>
  );
}
