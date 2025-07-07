import { t } from "i18next";
import { useState } from "react";
import { BsHeartFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export function CourseCard({
  id,
  imageUrl,
  title,
  description,
  hasImage = true,
}) {
  const [liked, setLiked] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const toggleLike = () => setLiked(!liked);

  return (
    <article className="flex relative grow shrink gap-9 items-start self-stretch my-auto min-w-60 w-[325px]">
      <div className="flex z-0 flex-col flex-1 shrink my-auto w-full bg-white basis-0 min-w-60 rounded-xl shadow-md p-4">
        {hasImage ? (
          <>
            {/* Skeleton shown while image loads or fails */}
            {(!isImageLoaded || hasImageError) && (
              <div className="w-full aspect-[2.06] bg-gray-200 animate-pulse rounded-lg mb-4" />
            )}
            {/* Actual Image */}
            {!hasImageError && (
              <img
                src={imageUrl}
                alt={title}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setHasImageError(true)}
                className={`object-contain w-full aspect-[2.06] rounded-lg mb-4 transition-opacity duration-300 ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
          </>
        ) : (
          <div className="w-full aspect-[2.06] bg-gray-200 animate-pulse rounded-lg mb-4" />
        )}

        {/* Title & Description */}
        <div className="w-full">
          <h3 className="text-2xl font-semibold text-zinc-800">{title}</h3>
          <p className="mt-2 text-sm leading-5 text-neutral-600">
            {description}
          </p>
        </div>

        {/* Button */}
        <Link
          to={`/CourseDetails/${id}`}
          onClick={() => window.scrollTo(0, 0)}
          aria-label={t("Detail")}
          data-testid="course-detail-link"
          className="gap-2 self-start px-8 py-3 mt-4 text-base leading-relaxed text-white bg-blue-500 rounded-full hover:bg-blue-600 transition"
        >
          {t("Detail")}
        </Link>
      </div>

      {/* Heart Icon */}
      <div className="flex absolute z-10 gap-4 items-center self-start right-[21px] top-[21px]">
        <BsHeartFill
          onClick={toggleLike}
          className={`w-10 h-10 cursor-pointer transition-colors duration-300 ${
            liked ? "text-red-600" : "text-gray-300"
          }`}
        />
      </div>
    </article>
  );
}
