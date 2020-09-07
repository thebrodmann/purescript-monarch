module Monarch.Svg
  ( module Monarch.VirtualDom.Text
  , Svg
  , svg , svg_, svg'
  )
where

import Type.Row as Row
import Monarch.Type.Row as Row
import Monarch.VirtualDom
import Monarch.VirtualDom as VirtualDom
import Monarch.VirtualDom.NS as NS
import Monarch.VirtualDom.Hooks
import Monarch.VirtualDom.Text
import Monarch.Svg.Attributes
import Monarch.Svg.Properties
import Monarch.Svg.Outputs

-- Data Type

type Svg = VirtualNode' NS.SVG

-- Elements

type Node r slots message = VirtualDom.Node NS.SVG r slots message

type Node_ slots message = VirtualDom.Node_ NS.SVG slots message

type Leaf r slots message = VirtualDom.Leaf NS.SVG r slots message

type SvgSvgR props hooks message = R SvgSvgElementAttributes (SvgSvgElementOutputs message) props hooks

svg :: forall r r' props hooks ns message
     . Row.Union r r' (SvgSvgR props hooks message)
    => Row.OptionalRecordCons r "props" (SvgSvgElementProperties ()) props
    => Row.OptionalRecordCons r "hooks" (Hooks message) hooks
    => { | r }
    -> Array (Svg message)
    -> VirtualNode' ns message
svg = h "svg"

svg_ :: forall ns message. Array (Svg message) -> VirtualNode' ns message
svg_ = h "svg" {} 

svg' :: forall ns message. VirtualNode' ns message
svg' = h "svg" {} []