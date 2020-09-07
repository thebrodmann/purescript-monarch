{-|
Module     : Monarch.Type.RowList
Maintainer : Mohammad Hasani (the-dr-lazy.github.io) <thebrodmann@protonmail.com>
Copyright  : (c) 2020 Monarch
License    : MPL 2.0

This Source Code Form is subject to the terms of the Mozilla Public
License, version 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
-}

module Monarch.Type.RowList where

import Type.RowList (kind RowList)
import Type.RowList as RowList
import Type.Row as Row

class OptionalRecordCons (row :: RowList) (name :: Symbol) (s :: # Type) (t :: # Type)

instance nilOptionalRecordCons :: OptionalRecordCons RowList.Nil _name _s _t
instance consOptionalRecordCons ::
  (Row.Union t _t s) => OptionalRecordCons (RowList.Cons name { | t } tail) name s t
else instance fallbackConsOptionalRecordCons ::
  (OptionalRecordCons tail name s t) => OptionalRecordCons (RowList.Cons _name _t tail) name s t