import { useMediaWatchProviders } from "../../entities/movie/useMediaWatchProviders";

export function MovieWatchProviders({ movieId }) {
  const { data, status } = useMediaWatchProviders(movieId);
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error</div>;
  }
  return (
    <div className="px-2 py-2">
      <div className="text-gray-12">Where To Watch</div>
      {data?.flatrate?.length > 0 && (
        <div className="text-gray-11">Streaming</div>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1">
        {data?.flatrate?.map((provider) => {
          return (
            <img
              alt="foo"
              key={provider.provider_id}
              className="w-12 h-12 rounded-md"
              src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
            />
          );
        })}
      </div>
      {data?.buyOrRent?.length > 0 && (
        <div className="text-gray-11">Buy/Rent</div>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1">
        {data?.buyOrRent?.map((provider) => {
          return (
            <img
              alt="foo"
              key={provider.provider_id}
              // className="object-cover object-top scale-[98%] h-12 w-12 mr-2 rounded-md"
              className="w-12 h-12 rounded-md"
              src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
            />
          );
        })}
      </div>
      {data?.buy?.length > 0 && <div className="text-gray-11">Buy</div>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1">
        {data?.buy?.map((provider) => {
          return (
            <img
              alt="foo"
              key={provider.provider_id}
              // className="object-cover object-top scale-[98%] h-12 w-12 mr-2 rounded-md"
              className="w-12 h-12 rounded-md"
              src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
            />
          );
        })}
      </div>
      {data?.rent?.length > 0 && <div className="text-gray-11">Rent</div>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1">
        {data?.rent?.map((provider) => {
          return (
            <img
              alt="foo"
              key={provider.provider_id}
              // className="object-cover object-top scale-[98%] h-12 w-12 mr-2 rounded-md"
              className="w-12 h-12 rounded-md"
              src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
            />
          );
        })}
      </div>
      <div className="py-2 text-sm text-gray-11">
        Brought to you by JustWatch
      </div>
    </div>
  );
}
