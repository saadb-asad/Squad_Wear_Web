
export const HomePage = () => {
  return (
    <main className="w-full max-w-max-width mx-auto px-4 lg:px-margin-desktop space-y-16 lg:space-y-24 py-8 lg:py-12">
      {/* Content ported from Stitch design */}

{/* Hero Section: Editorial Streetwear */}
<section className="relative grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
<div className="lg:col-span-5 space-y-8">
<div className="inline-block neo-recessed px-4 py-1 rounded-full text-secondary font-label-md text-label-sm uppercase tracking-widest">
                    Spring/Summer 2024
                </div>
<h1 className="font-headline-xl text-headline-lg lg:text-headline-xl text-on-surface">
                    TECHNICAL <br/>PRECISION. <br className="hidden lg:block"/>STREET <br className="hidden lg:block"/>CULTURE.
                </h1>
<p className="text-on-surface-variant max-w-md font-body-lg text-body-lg">
                    Engineered for the urban environment. Our latest drop fuses high-performance fabrics with silhouettes designed for movement.
                </p>
<div className="flex gap-4 pt-4 flex-col sm:flex-row">
<button className="neo-extruded neo-interactive px-8 lg:px-10 py-4 lg:py-5 rounded-xl bg-surface border border-secondary/10 flex items-center justify-center gap-3 w-full sm:w-auto">
<span className="font-label-md text-label-md text-on-surface font-bold">SHOP THE DROP</span>
<span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
<div className="lg:col-span-7">
<div className="neo-extruded rounded-[40px] p-6 bg-surface overflow-hidden">
<div className="aspect-[4/5] rounded-[24px] overflow-hidden">
<img className="w-full h-full object-cover" data-alt="A high-end editorial streetwear photography shot of a model wearing a technical oversized tactical jacket and cargo joggers in a minimalist architectural setting. The lighting is crisp and cool-toned, casting soft shadows that emphasize the high-tech fabric textures. The color palette is composed of off-whites, gunmetal greys, and deep forest greens, perfectly matching a professional light-mode neomorphic aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbQQ9K8wWX-_0VOexyq9EquKmtYKYWlgPgWiwVdnQGRlyILpiV7fBwnKJI3TI8ooW_KCGjYggxRbg4_0Q3-QepwHNDWBAYf2LIxyUT4i2itTsbjC_bM2qfW07gQz83urkuqBSrX_zXvLjNM9k_kq28WB34SxDb7ErvUHKdP-__SkDrRUJptSbSgLEaX2pXMYZhpLzV77eT-NC6uxt9pCJMbIcxJeo9MwKwxyihDKgEGE-p2_mMXAElOWHC4-Mz573hZUmwBrsDobHj"/>
</div>
</div>
{/* Floating Detail Card */}
<div className="hidden lg:block absolute -bottom-10 right-20 neo-extruded bg-surface p-6 rounded-2xl w-64 space-y-3">
<div className="flex justify-between items-center">
<span className="font-label-md text-label-sm text-secondary">FEATURED TECH</span>
<span className="material-symbols-outlined text-secondary text-sm">verified</span>
</div>
<p className="font-headline-md text-headline-md text-on-surface">X-Grip Shell</p>
<p className="text-on-surface-variant font-label-md text-label-sm">Water-repellent nanotechnology with 4-way stretch fiber.</p>
</div>
</div>
</section>
{/* New Drops Section: Neomorphic Product Cards */}
<section className="space-y-12">
<div className="flex justify-between items-end">
<div className="space-y-2">
<h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-on-surface">New Drops</h2>
<p className="text-on-surface-variant font-body-md text-body-md">Freshly extruded from the technical labs.</p>
</div>
<button className="neo-extruded-sm neo-interactive px-4 lg:px-6 py-2 lg:py-3 rounded-full font-label-md text-label-sm lg:text-label-md whitespace-nowrap">View All</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
{/* Product Card 1 */}
<div className="neo-extruded rounded-3xl p-4 bg-surface group cursor-pointer space-y-4">
<div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-low neo-recessed mb-4">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="A studio product shot of a premium off-white technical hoodie with modular pockets and adjustable drawstrings. The hoodie is presented against a clean light grey background with soft directional lighting that highlights its unique construction and stitching details. The mood is minimalist, modern, and high-fashion." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7RVti_D9Ep15yDLDJkNUIeP4Gf6RDf9_ZZtTSUafk1xNSP64P35KRtO4Z7u5BxtI1k1a0QvhUW61iylcTRLCL6QFg1P3rv8vBZzMsz6yXnD1KvM3l5NhddE-NzfVVKI-GvO6cV96v0vbIehRHx1QanpK-pFJPziOYfZVNcn8sRJgasKZSxLpaxG8bFiqnpMxSF1mvdkU-2eaRx5U8BYsh4NyzGWFxpYZR-kievm4CNYMJvIKlPoiuIagRaEuw923-GgT54YbA6x-V"/>
</div>
<div className="px-2">
<p className="text-on-surface-variant font-label-md text-label-sm">Outerwear</p>
<h3 className="font-headline-md text-headline-md text-on-surface">Nexus Hoodie</h3>
<div className="flex justify-between items-center pt-2">
<span className="font-bold text-on-surface">$145.00</span>
<button className="neo-extruded-sm neo-interactive p-2 rounded-full">
<span className="material-symbols-outlined text-secondary">add_shopping_cart</span>
</button>
</div>
</div>
</div>
{/* Product Card 2 */}
<div className="neo-extruded rounded-3xl p-4 bg-surface group cursor-pointer space-y-4">
<div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-low neo-recessed mb-4">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="Close up of high-tech tactical cargo pants in deep forest green featuring waterproof zippers and reinforced knees. Professional product photography on a bright surface with minimal shadows. Part of a high-end streetwear collection." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0l9SRgq7q59oXs1_6xr46jHKnHWOw8a07xNjtdGrRNudvgz4AMq15Vl7okyIjGYs-gp_2eLwBnYheudInraI-nssxkXM3YIQyvYlQR3bZcYz63WZSzZT964FHjHqMLpJsDtpqxzdbykVijiaixICXUN5syIth_yy4DCbNc9ht7q8rxX7MET7po0UFtYJIVYpZDYq6rQwni9HW2HkIeV_maw6AAOcqNAsIX0yTQon2W8pmLNEAfGr1-5E3RCI9g4VmZIfXo378F66t"/>
</div>
<div className="px-2">
<p className="text-on-surface-variant font-label-md text-label-sm">Legwear</p>
<h3 className="font-headline-md text-headline-md text-on-surface">Vector Cargo</h3>
<div className="flex justify-between items-center pt-2">
<span className="font-bold text-on-surface">$180.00</span>
<button className="neo-extruded-sm neo-interactive p-2 rounded-full">
<span className="material-symbols-outlined text-secondary">add_shopping_cart</span>
</button>
</div>
</div>
</div>
{/* Product Card 3 */}
<div className="neo-extruded rounded-3xl p-4 bg-surface group cursor-pointer space-y-4">
<div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-low neo-recessed mb-4">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="A modern techwear vest in matte black with reflective details and multiple utility straps. The product is shot from a three-quarter angle in a high-key studio environment to emphasize the contrast between the fabric textures and the soft white background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1BQ-ngAYGF4pIHoRvpwzkyUnf0VTeCAH4ueVjyd0mMi1SIJNkAGLRTRu2DEa9mF4kbp_WMx8YaGsTmMXTg-RzaiYnY8i0L5ApUTriUSeE5EfSLAeaWdkavfKRohMFAXDWS6qJ0UqhddFVk1fOMBNnZKdU4kBsLuzR7IvaRw9qcgnHrfkjQLA2EjNn5eVlIDyA8AdS6I83XTKhUDuh8x6_ylHNPRtBSnWyucE6JfJ6P0zXpYJxkpniYVJrIxRXwyjlZWXX_Sf_V1K1"/>
</div>
<div className="px-2">
<p className="text-on-surface-variant font-label-md text-label-sm">Tactical</p>
<h3 className="font-headline-md text-headline-md text-on-surface">Apex Utility Vest</h3>
<div className="flex justify-between items-center pt-2">
<span className="font-bold text-on-surface">$120.00</span>
<button className="neo-extruded-sm neo-interactive p-2 rounded-full">
<span className="material-symbols-outlined text-secondary">add_shopping_cart</span>
</button>
</div>
</div>
</div>
{/* Product Card 4 */}
<div className="neo-extruded rounded-3xl p-4 bg-surface group cursor-pointer space-y-4">
<div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-low neo-recessed mb-4">
<img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" data-alt="High-performance technical sneakers with a chunky neomorphic sole design in a monochrome palette of whites and light greys. The shoes are floating in mid-air to show the grip pattern and aerodynamic shape. Professional light-mode aesthetic for a streetwear brand." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgfelEJJvmuXlN9oFgWluQiTDuA8aEsVMN_d3T558i0kjyYYspLzfuMu2Nt2SkkCW87ul_N6e8p2QNozaJlhnicJl8M7mHB8PQYyfy9rI2ACiNthlDeYPhPVJ86nP8D1cEWNZyvEHaGp_1QkjLdqhDR__hSlOcpMSG4ai82NCVMbW-w1sZuh1blYO7jIWy8ZJGZ6dqLLedNFpPLN4iwtsUvxNWhp1tKxSWUm0wwodLHe5aj1qVevm-s5kMlcjq2ht7eOpQfgEaKZle"/>
</div>
<div className="px-2">
<p className="text-on-surface-variant font-label-md text-label-sm">Footwear</p>
<h3 className="font-headline-md text-headline-md text-on-surface">Stratus MK.1</h3>
<div className="flex justify-between items-center pt-2">
<span className="font-bold text-on-surface">$210.00</span>
<button className="neo-extruded-sm neo-interactive p-2 rounded-full">
<span className="material-symbols-outlined text-secondary">add_shopping_cart</span>
</button>
</div>
</div>
</div>
</div>
</section>
{/* Collection Highlights: Asymmetric Layout */}
<section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
<div className="neo-extruded p-8 rounded-[40px] bg-surface flex flex-col justify-between min-h-[500px]">
<div className="space-y-4">
<h2 className="font-headline-lg text-headline-md lg:text-headline-lg text-on-surface">The Monolith <br className="hidden lg:block"/>Collection</h2>
<p className="text-on-surface-variant font-body-md text-body-md max-w-xs">A tribute to minimalist forms and structural integrity. All-white technical gear for the purist.</p>
</div>
<div className="flex-grow my-8 neo-recessed rounded-3xl overflow-hidden">
<img className="w-full h-full object-cover" data-alt="A stunning monochrome visual of three models standing in a triangle formation, all dressed in all-white technical streetwear. The environment is a stark, white minimalist concrete structure with sharp angles and bright overhead lighting. The image captures a sense of futuristic unity and high-end design precision." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDN_Iwi9qw0CHA6CuKKlcs8xsmutG8kQ-lL-a48rIebI9fANYxN1fwuiWCv9GfnnkUOX5qvlq_TOQBmThTuWCQJNBFeqD9uEqKqHlJ49itpWlN71TDRoqR9sBXI-AEF0iJKSHB-_u4vsZUV3M8Xvn6jfgmnTv92W4r-7PcjkL43slUtju2CybCmhlq6-yJrBIilHVmoLGuJ4dtzYFrw3ewfCd0iPaRtYs3ge9bnPYOBlEPPSi6cbBSdEZCDs6cvLq64mghUzWcBKssc"/>
</div>
<button className="neo-extruded-sm neo-interactive py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-3">
                    EXPLORE COLLECTION
                    <span className="material-symbols-outlined">expand_circle_right</span>
</button>
</div>
<div className="space-y-gutter">
<div className="neo-extruded p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] bg-surface h-auto lg:h-[calc(50%-12px)] flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-8">
<div className="w-full lg:w-1/2 space-y-4">
<h3 className="font-headline-md text-headline-md text-on-surface text-center lg:text-left">Modular <br className="hidden lg:block"/>Accessories</h3>
<button className="text-secondary font-bold font-label-md text-label-md flex items-center gap-2 mx-auto lg:mx-0">VIEW SHOP <span className="material-symbols-outlined">east</span></button>
</div>
<div className="w-full lg:w-1/2 aspect-video lg:h-full lg:aspect-auto neo-recessed rounded-2xl overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Macro photography of modular techwear bag attachments, featuring heavy-duty buckles and waterproof nylon textures in a slate grey color. Soft shadows define the recessed buttons and straps, creating a tactile, neomorphic appearance." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBc1CSi3ilGPshixWU_bnwM1XuzRBGwBeQqa6RKa3rQP6-79L2djYCxyMU0PjOLlmhd_MoDnCuTzz-EsaB2RAMN2AXUt1d2z2_OpaX7D2StLUNpzM46cj8QOi9nX-GmO7El8LGwaa4l0G08ibrhIeogvCb2k7uA4bELuNZMfjKVl6FJmhKwO6GxomEmtkDzzEBIeAWC637EjLl6aHfunDSTaHnrKzXnUyJ-E7kPtEKS4-T5f3ucJYDhes71EwNm_rH5eO0NTGiB9qMT"/>
</div>
</div>
<div className="neo-extruded p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] bg-surface h-auto lg:h-[calc(50%-12px)] flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
<div className="w-full lg:w-1/2 aspect-video lg:h-full lg:aspect-auto neo-recessed rounded-2xl overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Streetwear model sitting on a minimalist white bench, wearing a reflective rain jacket that catches the light. The setting is a clean urban plaza at dusk with soft cool lighting. The aesthetic is modern, sleek, and premium." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-lioRZGVJawYMojpIoUZEptZbjypLgnhhuzsDtRlmHSyL5jNv8yJzohqsV_3OTowAHDA6Bzta_6WPCkJDaJFg-OcpV02J5_NmtliDezUD0Ufbxtg1zpGr_SBW0N3-3AEN6OaFfE7EvUo_MZR3-F_GNggA-sLFrflg8JzQalW8JdzjK0aOQ6fS7oCdzi8cAayIzTtHWsqaLOTmBLTPvfGAn1wHNZdRmaFXjOYVQzVZG51UmJMBAnQhncwC1QOldawn4_Nu5Tfc8hW9"/>
</div>
<div className="w-full lg:w-1/2 space-y-4">
<h3 className="font-headline-md text-headline-md text-on-surface text-center lg:text-left">Waterproof <br className="hidden lg:block"/>Series</h3>
<button className="text-secondary font-bold font-label-md text-label-md flex items-center gap-2 mx-auto lg:mx-0">EXPLORE <span className="material-symbols-outlined">east</span></button>
</div>
</div>
</div>
</section>
{/* Stay Informed: Newsletter Section */}
<section className="neo-extruded py-12 lg:py-20 px-6 lg:px-20 rounded-[32px] lg:rounded-[60px] bg-surface text-center space-y-8 lg:space-y-10">
<div className="max-w-2xl mx-auto space-y-6">
<div className="inline-flex neo-recessed p-4 rounded-full text-secondary mb-4">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
</div>
<h2 className="font-headline-xl text-headline-lg lg:text-headline-xl text-on-surface">Stay Informed</h2>
<p className="text-on-surface-variant font-body-lg text-body-lg">
                    Join the Squad Wear Inner Circle. Receive early access to drops, exclusive technical insights, and community-only events.
                </p>
<div className="flex flex-col sm:flex-row gap-4 pt-4">
<div className="flex-grow neo-recessed rounded-2xl p-2 flex items-center bg-surface">
<input className="w-full bg-transparent border-none focus:ring-0 px-4 font-body-md text-on-surface py-2 sm:py-0" placeholder="your@email.com" type="email"/>
</div>
<button className="neo-extruded neo-interactive px-8 lg:px-10 py-4 lg:py-5 rounded-2xl bg-on-surface text-surface font-bold font-label-md text-label-md whitespace-nowrap w-full sm:w-auto">
                        SUBSCRIBE NOW
                    </button>
</div>
<p className="text-on-surface-variant font-label-md text-label-sm">No spam. Only high-grade gear updates.</p>
</div>
</section>

    </main>
  );
};
