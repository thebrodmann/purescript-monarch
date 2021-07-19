{-|
Module     : Counter.Main
Maintainer : Mohammad Hasani (the-dr-lazy.github.io) <the-dr-lazy@pm.me>
Copyright  : (c) 2020-2021 Monarch
License    : MPL 2.0

This Source Code Form is subject to the terms of the Mozilla Public
License, version 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
-}

module Counter.Main (main) where

import Prelude
import Run                   ( Run, EFFECT )
import Effect                ( Effect )
import Effect.Aff            ( launchAff_ )
import Web.HTML              ( HTMLElement )
import Monarch.Command       ( Command )
import Monarch                                   as Monarch
import Monarch.Html
import Monarch.Event         ( Event
                             , eNever
                             )
import Counter.API                               as API

type Input = Unit

type Model = Int

data Message = UserClickedIncreaseButton
             | UserClickedDecreaseButton

type Output = Void

init :: Model
init = 0

update :: Message -> Model -> Model
update = case _ of
  UserClickedIncreaseButton -> (_ + 1)
  UserClickedDecreaseButton -> (_ - 1)

view :: Model -> Html Message
view model =
  div_ [ button { onClick: const UserClickedDecreaseButton } [ text "-" ]
       , text $ show model
       , button { onClick: const UserClickedIncreaseButton } [ text "+" ]
       ]

command :: Message
        -> Model
        -> Command (API.COUNTER ()) Message Output Unit
command message _ = case message of
  UserClickedIncreaseButton -> API.increase
  UserClickedDecreaseButton -> API.decrease

interpreter :: Command (API.COUNTER ()) Message Output Unit -> Command () Message Output Unit
interpreter = API.run

-- subscription :: Upstream Input Model Message -> Event Message
-- subscription = const eNever

main :: HTMLElement -> Effect Unit
main container = do
  Monarch.bootstrap { input: unit
                    , init: const init
                    , update
                    , view
                    , command
                    , interpreter
                    , container
                    , onOutput: \_ -> pure unit
                    }
