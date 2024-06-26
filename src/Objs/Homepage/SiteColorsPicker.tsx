import Color from 'color'
import { ColorPicker, ColorService } from 'react-color-palette'
import { connect, uiContext } from 'scrivito'
import { HomepageInstance } from './HomepageObjClass'
import './SiteColorsPicker.scss'
import { useEffect, useState } from 'react'

export const SiteColorsPicker = connect(function SiteColorsPicker({
  page,
}: {
  page: HomepageInstance
}) {
  const { theme } = uiContext() || { theme: null }
  if (!theme) return null

  return (
    <div
      className={`site-colors-picker scrivito_detail_content scrivito_${theme}`}
    >
      <div className="row">
        <div className="col-sm-6">
          <div className="scrivito_detail_label">
            <span>Primary color</span>
          </div>
          <AdvancedColorPicker
            color={page.get('siteColorPrimary') || '#274486'}
            setColor={(color) => {
              page.update({
                siteColorPrimary: color,
                siteColorPrimaryDarken: darken(color),
                siteColorPrimaryLighten: lighten(color),
              })
            }}
          />
        </div>

        <div className="col-sm-6">
          <div className="scrivito_detail_label">
            <span>Secondary color</span>
          </div>
          <AdvancedColorPicker
            color={page.get('siteColorSecondary') || '#39a9eb'}
            setColor={(color) => {
              page.update({
                siteColorSecondary: color,
                siteColorSecondaryDarken: darken(color),
                siteColorSecondaryLighten: lighten(color),
              })
            }}
          />
        </div>
      </div>
    </div>
  )
})

function AdvancedColorPicker({
  color,
  setColor,
}: {
  color: string
  setColor: (color: string) => void
}) {
  const [iColor, setIColor] = useState(ColorService.convert('hex', color))

  const [hexHsvCache, setHexHsvCache] = useState<
    Record<
      string,
      {
        readonly h: number
        readonly s: number
        readonly v: number
        readonly a: number
      }
    >
  >({})

  useEffect(() => {
    const cachedHsv = hexHsvCache[color]
    const newIColor = cachedHsv
      ? ColorService.convert('hsv', cachedHsv)
      : ColorService.convert('hex', color)

    setIColor(newIColor)
  }, [color, hexHsvCache])

  return (
    <ColorPicker
      height={100}
      color={iColor}
      hideInput={['hsv']}
      hideAlpha={true}
      onChange={(newIColor) => {
        const newColor = newIColor.hex
        setHexHsvCache((prev) => ({ ...prev, [newColor]: newIColor.hsv }))
        setColor(newColor)
      }}
    />
  )
}

function lighten(color: string): string {
  return Color(color).lighten(0.5).hex()
}

function darken(color: string): string {
  return Color(color).darken(0.5).hex()
}
