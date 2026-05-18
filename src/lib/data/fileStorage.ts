import { isFirebaseConfigured, storage } from "./firebaseSetup";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const fileStorage = {
  async uploadImage(
    userId: string,
    targetPath: string,
    file: File,
  ): Promise<string> {
    if (isFirebaseConfigured() && storage) {
      const storageRef = ref(
        storage,
        `users/${userId}/${targetPath}/${file.name}_${Date.now()}`,
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } else {
      // Local fallback using object URL or base64
      // Note: this is not persistent between reloads in case of object URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    }
  },
};
