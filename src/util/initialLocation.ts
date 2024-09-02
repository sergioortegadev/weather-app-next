import getGPSLocation from "@/util/getGPSLocation";

export default async function initialLocation(): Promise<string> {
  const savedLocation = localStorage.getItem("location");

  if (savedLocation !== null) {
    return savedLocation;
  } else {
    const location = await getGPSLocation();
    localStorage.setItem("location", location);
    return location;
  }
}
