import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";


import "swiper/css";
import "swiper/css/pagination";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";


export function Carousel() {
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <div className="relative">
            <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
                }}
                loop
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                className="w-full min-w-0 rounded-2xl shadow-lg"
            >
                <SwiperSlide>
                    <div className="relative h-[260px] overflow-hidden sm:h-[320px] md:h-[380px] lg:h-[420px]">
                        <img
                            src={banner1}
                            alt="Aticurando"
                            className="h-full w-full object-cover object-center"
                        />

                        <div className="absolute inset-0 flex flex-col justify-center bg-black/40 px-5 sm:px-8 md:px-10">
                            <h2 className="break-words text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                            Aticurando
                            </h2>

                            <p className="mt-3 max-w-xl break-words text-sm leading-relaxed text-slate-200 sm:text-base md:text-lg">
                                Associação Aticurando
                                Cultura e transformação social em Atibaia.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative h-[260px] overflow-hidden sm:h-[320px] md:h-[380px] lg:h-[420px]">
                        <img
                            src={banner2}
                            alt="Missão"
                            className="h-full w-full object-cover object-center"
                        />

                        <div className="absolute inset-0 flex flex-col justify-center bg-black/40 px-5 sm:px-8 md:px-10">
                            <h2 className="break-words text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                                Nossa Missão
                            </h2>

                            <p className="mt-3 max-w-xl break-words text-sm leading-relaxed text-slate-200 sm:text-base md:text-lg">
                                Trabalhamos diariamente para fortalecer nossa comunidade através do voluntariado e do fomento à cultura local.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative h-[260px] overflow-hidden sm:h-[320px] md:h-[380px] lg:h-[420px]">
                        <img
                            src={banner3}
                            alt="Impacto Social"
                            className="h-full w-full object-cover object-center"
                        />

                        <div className="absolute inset-0 flex flex-col justify-center bg-black/40 px-5 sm:px-8 md:px-10">
                            <h2 className="break-words text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                                Impacto Social
                            </h2>

                            <p className="mt-3 max-w-xl break-words text-sm leading-relaxed text-slate-200 sm:text-base md:text-lg">
                                Com atuação pautada pela ética e transparência, somos uma entidade formalmente constituída, com Estatuto Social registrado e reconhecida, desde 2020, como de Utilidade Pública.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
            <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 text-xl text-white transition hover:text-blue-400 sm:left-4 sm:text-2xl md:text-3xl"
            >
                <FaChevronLeft />
            </button>

            <button
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 text-xl text-white transition hover:text-blue-400 sm:right-4 sm:text-2xl md:text-3xl"
            >
                <FaChevronRight />
            </button>
        </div>
    );
}

