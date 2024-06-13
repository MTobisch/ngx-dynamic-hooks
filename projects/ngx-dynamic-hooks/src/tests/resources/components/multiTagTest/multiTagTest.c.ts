import { Component, OnInit, AfterViewInit, OnDestroy, Input, OnChanges, ChangeDetectorRef, DoCheck, Optional, Injector, inject } from '@angular/core';
import { DynamicContentChild, OnDynamicChanges, OnDynamicMount, OnDynamicData } from '../../../testing-api';
import { RootTestService } from '../../services/rootTestService';


@Component({
  selector: 'multitagtest',
  templateUrl: './multiTagTest.c.html',
  styleUrls: ['./multiTagTest.c.scss'],
  standalone: true
})
export class MultiTagTestComponent implements OnDynamicMount, OnDynamicChanges, DoCheck, OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() backgroundColor: string = '#4493ff40';
  @Input() nr!: number;
  @Input() fonts!: Array<string>;
  mountContext: any;
  mountContentChildren!: Array<DynamicContentChild>;
  changesContext: any;
  changesContentChildren!: Array<DynamicContentChild>;
  rootTestService: RootTestService;

  constructor(
    private cd: ChangeDetectorRef
  ) {
    // Test DI via inject()
    this.rootTestService = inject(RootTestService);
  }


  ngOnInit () {
    // console.log('textbox init');
  }

  ngOnChanges(changes: any) {
    // console.log('textbox changes');
  }

  ngDoCheck() {
    // console.log('textbox doCheck');
  }

  ngAfterViewInit() {
    // console.log('textbox afterviewinit');
  }

  ngOnDestroy() {
    // console.log('textbox destroy');
  }

  onDynamicMount(data: OnDynamicData) {
    this.mountContext = data.context;
    this.mountContentChildren = (data as any).contentChildren;
  }

  onDynamicChanges(data: OnDynamicData) {
    if (data.hasOwnProperty('context')) {
      this.changesContext = data.context;
    }
    if (data.hasOwnProperty('contentChildren')) {
      this.changesContentChildren = (data as any).contentChildren;
    }
  }

}
