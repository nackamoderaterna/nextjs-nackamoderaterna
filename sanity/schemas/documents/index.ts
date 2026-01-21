import {eventDocument} from './event'
import {geographicalArea} from './geographicalArea'
import {namnd} from './namnd'
import {namndPosition} from './namndPosition'
import {news} from './news'
import {page} from './page'
import {politicalArea} from './politicalArea'
import {politicalIssue} from './politicalIssue'
import {politician} from './politician'
import globalSettings from './singletons/globalSettings'
import navigationHeader from './singletons/navigationHeader'
import navigationFooter from './singletons/navigationFooter'
export const documents = [
  news,
  page,
  eventDocument,
  namnd,
  politician,
  namndPosition,
  politicalArea,
  politicalIssue,
  geographicalArea,
  navigationHeader,
  navigationFooter,
  globalSettings,
]
