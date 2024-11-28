import { Component, DestroyRef, inject, Injector, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { HeaderService } from '../../service/header/header.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  searchQuery = signal('');

  private injector = inject(Injector);

  constructor(
    private headerService: HeaderService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.subscribeSearchQuery();
  }

  private subscribeSearchQuery() {
    const searchQuery$ = toObservable(this.searchQuery, {
      injector: this.injector,
    });
    const userTypeTimeout = 500;
    searchQuery$
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          debounceTime(userTypeTimeout)
        )
        .subscribe((query) => {
          if (!!query && query.length > 2) {
            this.headerService.searchQuery.set(query);
          }
        });
  }
}
