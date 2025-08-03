import React, { FC, useEffect, useRef, useState } from 'react'
import CountUp from 'react-countup'
import gsap from 'gsap';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import 'swiper/scss/pagination';
import "swiper/css";

import { ReactComponent as ArrowLeft } from './arrowleft.svg';
import { ReactComponent as ArrowRight } from './arrowright.svg';
import '../component/DateSlider.styles.scss'

type DateItem = {
	title: string;
	description: string;
};

interface Category {
	name: string;
	dates: DateItem[];
}

interface DateSliderProps {
	categories: Category[];
}

const DateSlider: FC<DateSliderProps> = ({ categories }) => {
	const swiperRef = useRef<SwiperCore | null>(null);
	const [isSwiperOnEnd, setIsSwiperOnEnd] = useState(false);
	const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
	const [currentDateIndex, setCurrentDateIndex] = useState(0);
	const [prevCategoryIndex, setPrevCategoryIndex] = useState(0);
	const [isClickable, setIsClickable] = useState(true);
	const [timed, setTimed] = useState(true);
	const [currentDate, setCurrentDate] = useState<string[]>([]);
	const [prevDate, setPrevDate] = useState<string[]>([]);

	const sliderSettings = {
		0: {
			slidesPerView: 2,
			spaceBetween: 25,
		},
		500: {
			slidesPerView: 1,
			spaceBetween: 40,
		},
		800: {
			slidesPerView: 2,
			spaceBetween: 40,
		},
		1265: {
			slidesPerView: 3,
			spaceBetween: 40,

		},
	};

	const prevPage = () => {
		if (swiperRef.current) {
			swiperRef.current.slidePrev();
		}
	};

	const nextPage = () => {
		if (swiperRef.current) {
			swiperRef.current.slideNext();
		}
	};

	const currentDates = categories[currentCategoryIndex].dates;

	const positions = [
		{ x: 120, y: -220 },
		{ x: 250, y: 0 },
		{ x: 120, y: 220 },
		{ x: -120, y: 220 },
		{ x: -250, y: 0 },
		{ x: -120, y: -220 },
	]

	const midCircle = useRef(null);
	const orbs = useRef<(HTMLDivElement | null)[]>([]);

	const handleCategoryChange = (newCategoryIndex: number) => {
		setTimed(false)
		setCurrentDate([categories[newCategoryIndex].dates[0].title, categories[newCategoryIndex].dates[categories[newCategoryIndex].dates.length - 1].title])
		setPrevDate([currentDates[0].title, currentDates[currentDates.length - 1].title])
		setPrevCategoryIndex(currentCategoryIndex);
		setCurrentCategoryIndex(newCategoryIndex);
		setCurrentDateIndex(0);
		swiperRef.current?.slideTo(0);
		setTimeout(() =>
			setTimed(true), 100)
	};

	const tl = useRef<gsap.core.Timeline | null>(null);

	useEffect(() => {
		tl.current = gsap.timeline({
			defaults: {
				duration: 1,
				ease: 'Power3.easeInOut',
				rotate: `+=${60 * (currentCategoryIndex - prevCategoryIndex)}`,
				transformOrigin: "center center",
				repeatRefresh: true,
				delay: 0,
				onStart: () => setIsClickable(false),
				onComplete: () => setIsClickable(true),
			},
		})
			.to(orbs.current, { rotation: `+=${60 * (currentCategoryIndex - prevCategoryIndex)}` }, 0)
			.to(midCircle.current, { rotation: `-=${60 * (currentCategoryIndex - prevCategoryIndex)}` }, 0)
	}, [currentCategoryIndex, prevCategoryIndex, currentDate]);

	function rotate() {
		if (tl.current) {
			tl.current.play();
		}
	}

	useEffect(() => {
		rotate();
	}, [currentCategoryIndex, currentDate]);

	return (
		<div className="date-slider">
			<div className="date-decoration">
				<div className="outer-border">
					<div className="inner-y-border"></div>
					<div className="inner-x-border"></div>
					<div className="inner-middle-border">
						<div ref={midCircle} id='middle-circle' className="middle-circle">
							{
								categories.map((item, id) => (
									<div
										ref={el => { orbs.current[id] = el; }}
										key={item.name}
										style={{ transform: `translate(${positions[id].x}px, ${positions[id].y}px)` }}
										className={`orbs orb-${id}`}>
										<div
											id={'orb'}
											onClick={() => isClickable ? handleCategoryChange(id) : ''}
											className={`rotating__orb ${id === currentCategoryIndex ? 'active' : ''}`}
										>
											<p>{id + 1}</p>
											<h2>{categories[id].name}</h2>
										</div>
									</div>
								))
							}
						</div>
					</div>
				</div>
			</div>
			<div className="date-slider__container">
				<div className="date-slider-top">
					<div className="date-slider-header">
						<div className='date-slider-header__slider'></div>
						<h1 className='date-slider-header__title'>Исторические <br /> даты</h1>
					</div>
				</div>
				<div className="date-slider-mid">
					<div className='date-slider-carousel'>
						<CountUp separator="" start={((prevDate[0]) === undefined) ? (Number(currentDates[0].title)) : (Number(prevDate[0]))} end={Number(currentDate[0])} duration={0.8}>
							{
								({ countUpRef }) => (
									<span ref={countUpRef} className='date-slider-carousel__date1' />
								)}
						</CountUp>
						<CountUp separator="" start={((prevDate[1]) === undefined) ? Number(currentDates[currentDates.length - 1].title) : Number(prevDate[1])} end={Number(currentDate[1])} duration={0.8}>
							{
								({ countUpRef }) => (
									<span ref={countUpRef} className='date-slider-carousel__date2' />
								)}
						</CountUp>
					</div>
					<h4 className='date-slider-mid__categoryname'>{categories[currentCategoryIndex].name}</h4>
				</div>
				<div className="date-slider-bottom">
					<div className="date-slider-pagination">
						<p className="pagination__counter">{0}{currentCategoryIndex + 1}/ {0}{categories.length}</p>
						<div className="pagination-buttons">
							<button className={`pagination-buttons left ${currentCategoryIndex === 0 ? 'disabled' : ''}`}
								disabled={currentCategoryIndex === 0}
								onClick={() => isClickable ? handleCategoryChange(currentCategoryIndex - 1) : ''}
							><ArrowLeft /></button>
							<button className={`pagination-buttons right ${currentCategoryIndex === categories.length - 1 ? 'disabled' : ''}`}
								disabled={currentCategoryIndex === categories.length - 1}
								onClick={() => isClickable ? handleCategoryChange(currentCategoryIndex + 1) : ''}
							><ArrowRight /></button>
						</div>
					</div>
					<div className="date-slider-dates">
						<button className={`prev navigation ${currentDateIndex === 0 ? ' disabled-full' : ''}`} onClick={() => prevPage()}>{"<"}</button>
						<Swiper
							watchSlidesProgress={true}
							onSlideChange={(swiper) => setCurrentDateIndex(swiper.activeIndex)}
							onReachEnd={() => setIsSwiperOnEnd(true)}
							onReachBeginning={() => setIsSwiperOnEnd(false)}
							slidesPerView={3}
							spaceBetween={40}
							breakpoints={sliderSettings}
							onBeforeInit={(swiper) => { swiperRef.current = swiper; }}
							className={`slider-swiper ${isClickable ? 'visible' : 'disabled-full'} `}
							pagination={{
								clickable: true,
							}}
							modules={[Pagination]}>
							{currentDates.map((item, id) =>
								<SwiperSlide key={id} className="slider-date">
									<div className="slider-date__title">{timed ? item.title : categories[prevCategoryIndex].dates[id]?.title}</div>
									<div className="slider-date__description">{timed ? item.description : categories[prevCategoryIndex].dates[id]?.description}</div>
								</SwiperSlide>
							)}
						</Swiper>
						<button className={`next navigation ${isSwiperOnEnd ? ' disabled-full' : ''}`} onClick={() => nextPage()}>{'>'}</button>
					</div>
				</div >
				<div className="date-slider-pagination mobile">
					<p className="pagination__counter mobile">{0}{currentCategoryIndex + 1}/ {0}{categories.length}</p>
					<div className="pagination-buttons mobile">
						<button className={`pagination-buttons mobile left ${currentCategoryIndex === 0 ? 'disabled' : ''}`}
							disabled={currentCategoryIndex === 0}
							onClick={() => isClickable ? handleCategoryChange(currentCategoryIndex - 1) : ''}
						><ArrowLeft /></button>
						<button className={`pagination-buttons mobile right  ${currentCategoryIndex === categories.length - 1 ? 'disabled' : ''}`}
							disabled={currentCategoryIndex === categories.length - 1}
							onClick={() => isClickable ? handleCategoryChange(currentCategoryIndex + 1) : ''}
						><ArrowRight /></button>
					</div>
				</div>
			</div>
		</div >
	)
}

export default DateSlider