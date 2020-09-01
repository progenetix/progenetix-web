export default function fetcher(...args) {
  return fetch(...args).then((res) => res.json())
}

export const svgFetcher = (...args) => fetch(...args).then((r) => r.text())
