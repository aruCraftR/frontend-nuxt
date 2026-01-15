/* eslint-disable @typescript-eslint/no-explicit-any */
// types/api.d.ts

type Colors = "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error"
type AsideItem = 'sep' | AsideLink


export interface AsideLink {
    label: string,
    icon: string,
    to: string,
    color?: Colors,
}
