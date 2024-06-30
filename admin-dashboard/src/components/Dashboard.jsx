import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
function Dashboard() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const storeRef = ref(storage, "gs://fir-explorer-9c40f.appspot.com");
      const result = await listAll(storeRef);
      const urls = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const docRef = doc(db, "images", item.name);

          // retrieves the document snapshot for the given document reference
          const docSnap = await getDoc(docRef);
          const status = docSnap.exists() ? docSnap.data().status : "enabled";
          return { url, name: item.name, status };
        })
      );
      setImages(urls);
      setLoading(false);
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <h4 style={{ color: "lightcoral" }}>Loading... Patience, Please!</h4>
    );
  }

  const updateImageStatus = async (name, status) => {
    await setDoc(doc(db, "images", name), { status });
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.name === name ? { ...image, status } : image
      )
    );
  };

  return (
    <div>
      <h1 style={{ margin: "5px" }}>Admin Dashboard</h1>
      <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
        <div className="border-b mb-5 flex justify-between text-sm">
          <div className="text-indigo-600 flex items-center pb-2 pr-2 border-b-2 border-indigo-600 uppercase">
            <a href="#" className="font-semibold inline-block">
              Cooking BLog
            </a>
          </div>
          <a href="#">See All</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {images.map((image, index) => {
            return (
              <div
                key={index}
                className="rounded overflow-hidden shadow-lg flex flex-col"
              >
                <a href="#"></a>
                <div className="relative">
                  <a href="#">
                    <img
                      src={image.url}
                      alt={`firebase-image-${index}`}
                      className="w-full h-[25vh]"
                    />
                  </a>
                </div>
                <div className="px-6 py-4 mb-auto">
                  <a
                    href="#"
                    className="font-medium text-lg inline-block hover:text-indigo-600 transition duration-500 ease-in-out mb-2"
                  >
                    Item Name
                  </a>
                  <p className="text-gray-500 text-sm">Item Description</p>
                </div>
                <div className="px-6 py-3 flex flex-row items-center justify-between bg-gray-100">
                  <span
                    href="#"
                    className={`py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center`}
                  >
                    <button
                      onClick={() => updateImageStatus(image.name, "enabled")}
                      disabled={image.status === "enabled"}
                      className={`py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center ${
                        image.status === "enabled"
                          ? "text-slate-400 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Enable Item
                    </button>
                  </span>

                  <span
                    href="#"
                    className={`py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center`}
                  >
                    <button
                      onClick={() => updateImageStatus(image.name, "disabled")}
                      disabled={image.status === "disabled"}
                      className={`py-1 text-xs font-regular text-gray-900 mr-1 flex flex-row items-center ${
                        image.status === "disabled"
                          ? "text-slate-400 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Disable Item
                    </button>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
