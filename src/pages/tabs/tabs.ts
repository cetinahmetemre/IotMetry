import { Component } from '@angular/core';

import { KanalolusturPage } from '../kanalolustur/kanalolustur';
import { KanalPage } from '../kanallistele/kanallistele';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = KanalPage;
  tab2Root = KanalolusturPage;

  constructor() {

  }
}
