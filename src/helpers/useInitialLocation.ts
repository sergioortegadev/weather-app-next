import useGetGPSLocation from "@/helpers/useGetGPSLocation";

export default async function useInitialLocation(): Promise<string> {
  const savedLocation = localStorage.getItem("location");

  if (savedLocation !== null) {
    return savedLocation;
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const location = await useGetGPSLocation();
    localStorage.setItem("location", location);
    return location;
  }
}
