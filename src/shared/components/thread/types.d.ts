interface HashTag {
  id: string;
  tag: string;
}

interface Thread {
  id: string;
  userId: string;
  text: string;
  imageUris: string[];
  hashTags: HashTag[],
  location?: [latitude: number, longtitude: number],
  createdAt: Date;
}
