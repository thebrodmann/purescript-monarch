{-|
Module     : Monarch.Html.Attributes
Maintainer : Mohammad Hasani (the-dr-lazy.github.io) <thebrodmann@protonmail.com>
Copyright  : (c) 2020 Monarch
License    : MPL 2.0

This Source Code Form is subject to the terms of the Mozilla Public
License, version 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
-}

module Monarch.Html.Attributes where

import Type.Row    ( type (+) )
import Monarch.VirtualDom.Attributes

type HTMLDivElementAttributes r = GlobalAttributes r

type HTMLButtonElementAttributes r
  = GlobalAttributes
  + ( autofocus :: Boolean -- | Automatically focus the form control when the page is loaded
    , disabled  :: Boolean -- | Whether the form control is disabled
    | r
    )