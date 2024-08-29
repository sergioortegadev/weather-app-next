import useGetGPSLocation from "@/helpers/useGetGPSLocation";

export default async function useInitialLocation(): Promise<string> {
  const savedLocation = localStorage.getItem("location");

  if (savedLocation !== null) {
    return savedLocation;
  } else {
    const location = await useGetGPSLocation();
    localStorage.setItem("location", location);
    return location;
  }
}
