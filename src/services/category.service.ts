
export const categoryServices = {
  getAllCategories: async function () {
    try {
      const res = await fetch(`${process.env.API_URL}/api/v1/categories`, {
        cache: "no-store",
      });

      const data = await res.json();

      return { data: data.data, error: null };
    } catch (err) {
      console.error(err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },
};
