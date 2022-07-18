// use a condition type with an infer declaration to infer the type of an element in the array

import { getUser } from "../lib/data";

// https://bobbyhadz.com/blog/typescript-array-element-type#:~:text=To%20get%20th%20element%20type,branch%20of%20the%20conditional%20type.&text=Copied!
export type ArrElement<ArrType> = ArrType extends readonly (infer ElementType)[] ? ElementType : never;

// export type VideoArr = Awaited<ReturnType<typeof getVideos>>;
// export type VideoT = ArrElement<VideoArr>;

export type UserT = Awaited<ReturnType<typeof getUser>>