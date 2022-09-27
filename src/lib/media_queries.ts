import { browser } from '$app/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, share } from 'rxjs/operators';

/**
 * Factory function for creating Media Query Observables.
 *
 * The Observable pipes through a `BehaviorSubject` connector so only one event
 * handler is every made (a single event context handler for all subscriptions)
 * ```
 * .pipe(
 *  share({
 *     connector: () => new BehaviorSubject<boolean>(init),
 *   })`
 * )
 * ```
 *
 * @param query
 * @param init
 * @returns
 */
const mediaQueryFactory = (query: string, init = true) => {
	//  If running on the server just return an observable of the initial value
	if (!browser) return of(init);

	return new Observable<boolean>((observer) => {
		const root = window;
		const mq = root.matchMedia(query);

		// call next() when someone first subscribes. The multicast will handle further subscriptions
		if (init !== mq.matches) observer.next(mq.matches);

		/* Register for future events */
		const listener = (evt: MediaQueryListEvent) => observer.next(evt.matches);

		/**
		 * The MediaQuery.addListener is deprecated in favour of addEventListener
		 * Check if the device supports the 'change' event otherwise fall back
		 * to `addListener`.
		 *
		 * For further details see:
		 * https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener
		 *
		 */
		if (typeof mq.addEventListener === 'function') {
			mq.addEventListener('change', listener);
		} else {
			mq.addListener(listener);
		}

		return {
			unsubscribe() {
				// Complete the observable before removing the listener
				observer.complete();

				if (typeof mq.removeEventListener === 'function') {
					mq.removeEventListener('change', listener);
				} else {
					mq.removeListener(listener);
				}
			}
		};
	}).pipe(
		share({
			connector: () => new BehaviorSubject<boolean>(init)
		})
	);
};

/**
 * The correction is the offset required to transforming svg element to make
 * horizontal and vertical lines look sharp on all displays.
 *
 * On devices with a pixel density of 1 (or below), lines will appear blurry
 * if the computed pixel lies between an actual pixel (hardware). The line will
 * spread across both pixels with an opacity of 0.5 making them not look very sharp.
 *
 * The pixel density can change depending on what screen it is on, i.e. dragging a
 * window from one screen to another but can be monitored with a media query.
 *
 * See the below for further details
 * https://stackoverflow.com/questions/19558454/how-to-handle-svg-pixel-snapping
 */
const correction$: Observable<number> = mediaQueryFactory('(resolution: 1dppx)').pipe(
	map((matches) => (matches ? 0.5 : 0))
);

export { correction$ };
