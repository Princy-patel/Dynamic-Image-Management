import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

function Cart() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const storeRef = ref(storage, "gs://fir-explorer-9c40f.appspot.com");
      const result = await listAll(storeRef);
      const urls = await Promise.all(
        result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const docRef = doc(db, "images", item.name);
          const docSnap = await getDoc(docRef);
          const status = docSnap.exists() ? docSnap.data().status : "enabled";
          return { url, name: item.name, status };
        })
      );
      setImages(urls);
    };

    fetchImages();
  }, []);

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
      {images.map((image, index) => (
        <div key={index}>
          <img
            src={image.url}
            alt={`firebase-image-${index}`}
            width={300}
            height={300}
          />
          <button
            style={{ margin: "5px" }}
            onClick={() => updateImageStatus(image.name, "enabled")}
            disabled={image.status === "enabled"}
          >
            Enable Item
          </button>
          <button
            style={{ margin: "5px" }}
            onClick={() => updateImageStatus(image.name, "disabled")}
            disabled={image.status === "disabled"}
          >
            Disable Item
          </button>
        </div>
      ))}
    </div>
  );
}

export default Cart;
