import { animationFrameScheduler, fromEvent, Observable } from 'rxjs';
import { debounceTime, map, pairwise, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { pointer } from 'd3';

/**
 *
 * [x,y] co-ordinate drag and drop utility function
 *
 * Returns Observable of the [x,y] co-ordinates (pixels) with respect to the supplied container.
 * The observable will start emitting after a `mousedown` on the specified target, and will
 * stop emitting after the `mouseup` event (on the Document object).
 *
 * The events are the [x,y] co-ordinates (pixels)of the mousemove event relative to the
 * container element (second argument).
 *
 * @param mousedownTarget target element to listen for `mousedown` events
 * @param container element used to calculate [x,y]
 * @returns Observable of the change in [x,y] pixels between `mousemove` events
 */
export const dragHandler = (
	mousedownTarget: HTMLElement | SVGElement | Document,
	container: HTMLElement | SVGElement | Document
): Observable<[number, number]> => {
	const mousedown$ = fromEvent<MouseEvent>(mousedownTarget, 'mousedown');
	const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
	const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');

	return mousedown$.pipe(
		switchMap(() => {
			return mousemove$.pipe(
				// only emit the last event before the next render
				debounceTime(0, animationFrameScheduler),
				map((moveEvt) => pointer(moveEvt, container)),
				takeUntil(mouseup$)
			);
		})
	);
};

/**
 * Change in [x,y] drag and drop utility function
 *
 * Returns an Observable of the change in [x,y] pixels between `mousemove` events.
 * The observable will start emitting after a `mousedown` on the specified target and will
 * stop emitting after the `mouseup` event (on the Document object).
 *
 * The events are the change in [x,y] pixels (delta) of the mousemove event relative to the
 * container element (second argument).
 *
 * @param mousedownTarget target element to listen for `mousedown` events
 * @returns Observable of the change in [x,y] pixels between `mousemove` events
 */
export const dragHandlerDelta = (
	mousedownTarget: HTMLElement | SVGElement | Document
): Observable<[number, number]> => {
	return dragHandler(mousedownTarget, document).pipe(
		pairwise(),
		map(([p0, p1]) => [p1[0] - p0[0], p1[1] - p0[1]] as [number, number]),
		startWith([0, 0] as [number, number])
	);
};
