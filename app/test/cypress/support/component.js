import './commands';
import '@cypress/code-coverage/support';

import 'quasar/src/css/index.sass';
import 'src/css/app.scss';

import 'quasar/icon-set/material-icons';
import '@quasar/extras/material-icons/material-icons.css';

import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-e2e-cypress';
import { Dialog } from 'quasar';

import { VueTestUtils } from 'cypress/vue';
const { config } = VueTestUtils;

config.global.mocks = {
  $t: () => '',
};

config.global.stubs = {};

installQuasarPlugin({ plugins: { Dialog } });
