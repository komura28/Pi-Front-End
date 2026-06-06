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
                className="rounded-2xl shadow-lg"
            >
                <SwiperSlide>
                    <div className="relative h-[400px]">
                        <img
                            src={banner1}
                            alt="Aticurando"
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-10">
                            <h2 className="text-4xl font-bold text-white">
                            Aticurando
                            </h2>

                            <p className="mt-3 text-lg text-slate-200 max-w-xl">
                                Associação Aticurando
                                Cultura e transformação social em Atibaia.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative h-[400px]">
                        <img
                            src={banner2}
                            alt="Missão"
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-10">
                            <h2 className="text-4xl font-bold text-white">
                                Nossa Missão
                            </h2>

                            <p className="mt-3 text-lg text-slate-200 max-w-xl">
                                Trabalhamos diariamente para fortalecer nossa comunidade através do voluntariado e do fomento à cultura local.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide>
                    <div className="relative h-[400px]">
                        <img
                            src={banner3}
                            alt="Impacto Social"
                            className="h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-10">
                            <h2 className="text-4xl font-bold text-white">
                                Impacto Social
                            </h2>

                            <p className="mt-3 text-lg text-slate-200 max-w-xl">
                                Com atuação pautada pela ética e transparência, somos uma entidade formalmente constituída, com Estatuto Social registrado e reconhecida, desde 2020, como de Utilidade Pública.
                            </p>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
            <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="
        absolute left-4 top-1/2 z-20
        -translate-y-1/2
        text-white
        text-3xl
        hover:text-blue-400
        transition
    "
            >
                <FaChevronLeft />
            </button>

            <button
                onClick={() => swiperRef.current?.slideNext()}
                className="
       absolute right-4 top-1/2 z-20
        -translate-y-1/2
        text-white
        text-3xl
        hover:text-blue-400
        transition
    "
            >
                <FaChevronRight />
            </button>
        </div>
    );
}

