



import React from "react";





export function Countdown({ time }: { time: number }) {
	
	/* A lot more complicated than I expected... */
	
	const delta = time - Date.now();
	const [seconds, setSeconds] = React.useState(Math.ceil((delta - 50)/1000));
	
	React.useEffect(() => {
		
		let interval: NodeJS.Timeout;
		
		let nextSecondDelta = delta % 1000; // Deal with fractional seconds neatly
		
		setTimeout(() => {
			
			const tick = () => {
				
				let delta = time - Date.now() - 50; // The 50 accounts for undershooting
				
				let newSeconds = Math.ceil(delta/1000);
				
				if (newSeconds <= 0) {
					setSeconds(0);
					clearInterval(interval);
				}
				else {
					setSeconds(newSeconds);
				}
				
			};
			
			tick();
			interval = setInterval(tick, 1000);
			
		}, nextSecondDelta);
		
		return () => {
			if (interval)
				clearInterval(interval);
		}
		
	}, []);
	
	return (
		<span className="countdown">{seconds}</span>
	);
	
	
}








