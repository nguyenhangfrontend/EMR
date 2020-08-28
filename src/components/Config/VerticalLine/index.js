import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Main } from './styled';

const VerticalLine = forwardRef((props, ref) => {
	const [left, setLeft] = useState(0);
	const [showVerticalLine, setShowVerticalLine] = useState('none');
	
	useEffect(() => {
		// document.addEventListener('mousemove', onMove);
		//
		// return () => {
		// 	document.removeEventListener('mousemove', onMove);
		// }
	}, []);

	const showLine = (e) => {
		setLeft(e.clientX - 240);
		setShowVerticalLine('block');
	};
	const hideLine = () => {
		setShowVerticalLine('none')
	};

	const onMove = (e) => {
		setLeft(e.clientX - 240);
	};
	
	useImperativeHandle(ref, () => ({
		showLine,
		hideLine,
		onMove,
	}));

	return (
		<Main style={{ left: `${left}px`, display: showVerticalLine}} />
	);
});


VerticalLine.defaultProps = {};

VerticalLine.propTypes = {};

export default VerticalLine
