import React from 'react';
import {registerRoot,Still} from 'remotion';
import {APIRepair} from './APIRepair';
import config from './api-repair.json';
const RepairRoot:React.FC=()=> <Still id="API-original-notes" component={APIRepair} width={config.width} height={config.height}/>;
registerRoot(RepairRoot);
