export class ImageColor {
  private readonly _id: string
  private readonly _url: string
  private readonly _color: string

  constructor({ id, url, color }: { id?: string; url: string; color: string }) {
    this._id = id
    this._url = url
    this._color = color
  }

  get id(): string {
    return this._id
  }

  get url(): string {
    return this._url
  }

  get color(): string {
    return this._color
  }
}
