import {register} from 'be-hive/register.js';
import {tagName } from './be-switched.js';
import './be-switched.js';

const ifWantsToBe = 'switched';
const upgrade = '*';

register(ifWantsToBe, upgrade, tagName);