import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { searchProduct } from "@/services/productService";
import { useNavigate } from "react-router";
import { API_URL } from "@/config/env";

const formatPrice = (price, discount) => {
	try {
		const p = typeof price === "number" ? price : parseFloat(price || 0);
		const d = typeof discount === "number" ? discount : parseFloat(discount || 0);
		const effective = isFinite(d) && d > 0 ? p * (100 - d) / 100 : p;
		return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(effective);
	} catch {
		return "";
	}
};

const getThumbUrl = (thumbnail) => {
	if (!thumbnail || typeof thumbnail !== "string") return "/vite.svg";
	if (thumbnail.startsWith("http")) return thumbnail;
	// Derive server origin from API_URL (handles when API_URL includes path like /api/v1)
	let origin = "";
	try {
		const u = new URL(API_URL, window.location.origin);
		origin = `${u.protocol}//${u.host}`;
	} catch {
		origin = window.location.origin;
	}
	if (thumbnail.startsWith("/")) return `${origin}${thumbnail}`; // e.g., /uploads/products/abc.jpg
	if (thumbnail.includes("uploads/")) return `${origin}/${thumbnail}`; // e.g., uploads/products/abc.jpg
	return `${origin}/uploads/products/${thumbnail}`; // e.g., abc.jpg
};

const SearchBar = ({ placeholder = "Tìm sản phẩm...", onSelect, className = "" }) => {
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [results, setResults] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const lastRequestId = useRef(0);
	const containerRef = useRef(null);
	const [triggerWidth, setTriggerWidth] = useState(0);

	// Keep popover width equal to trigger width
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const update = () => setTriggerWidth(el.offsetWidth || 0);
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		window.addEventListener("resize", update);
		return () => {
			try { ro.disconnect(); } catch {}
			window.removeEventListener("resize", update);
		};
	}, []);

	// Debounced search
	useEffect(() => {
		const q = query.trim();
		if (!q) {
			setResults([]);
			setError("");
			setLoading(false);
			setOpen(false);
			return;
		}

		setLoading(true);
		setOpen(true);
		const rid = ++lastRequestId.current;
		const t = setTimeout(async () => {
			try {
				const data = await searchProduct(q);
				if (lastRequestId.current !== rid) return; // ignore stale
				const arr = Array.isArray(data)
					? data
					: Array.isArray(data?.content)
						? data.content
						: Array.isArray(data?.products)
							? data.products
							: [];
				setResults(arr);
				setError("");
			} catch (e) {
				if (lastRequestId.current !== rid) return;
				setResults([]);
				setError(e?.message || "Tìm kiếm thất bại");
			} finally {
				if (lastRequestId.current === rid) setLoading(false);
			}
		}, 300);
		return () => clearTimeout(t);
	}, [query]);

	const handleSelect = (item) => {
		setOpen(false);
		if (onSelect) return onSelect(item);
		// Default navigation to product detail
		navigate(`/products/${item?.id}`);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div ref={containerRef} className={`relative ${className}`}>
					<Input
						value={query}
						onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
						onFocus={() => { setOpen(true); }}
						placeholder={placeholder}
						className="bg-white text-black placeholder:text-gray-500"
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={6}
				className="p-0 overflow-hidden"
				style={{ width: triggerWidth || undefined }}
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<div className="max-h-80 overflow-y-auto">
					{loading && (
						<div className="p-3 space-y-3">
							<div className="flex items-center gap-3">
								<Skeleton className="h-12 w-12" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Skeleton className="h-12 w-12" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-2/3" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
						</div>
					)}
					{!loading && error && (
						<div className="p-3 text-sm text-red-600">{error}</div>
					)}
					{!loading && !error && results.length === 0 && query.trim().length > 0 && (
						<div className="p-3 text-sm text-gray-600">Không tìm thấy sản phẩm</div>
					)}
					{!loading && !error && results.length > 0 && (
						<ul className="divide-y divide-gray-200">
							{results.map((item) => (
								<li key={item.id}>
									<button
										className="w-full text-left p-3 hover:bg-gray-100 flex items-center gap-3"
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => handleSelect(item)}
									>
										<img
											src={getThumbUrl(item.thumbnail)}
											alt={item.name}
											className="w-12 h-12 object-cover rounded"
											onError={(e) => { e.currentTarget.src = "/vite.svg"; }}
										/>
										<div className="min-w-0 flex-1">
											<div className="text-sm font-medium truncate">{item.name}</div>
											<div className="text-xs text-gray-600">
												{(() => {
													const p = typeof item.price === "number" ? item.price : parseFloat(item.price || 0);
													const d = typeof item.discount === "number" ? item.discount : parseFloat(item.discount || 0);
													const hasDiscount = isFinite(d) && d > 0;
													const effective = hasDiscount ? (p * (100 - d) / 100) : p;
													const fmt = (v) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);
													return hasDiscount ? (
														<>
															<span className="font-semibold text-red-600">{fmt(effective)}</span>
															<span className="line-through text-gray-400 ml-2">{fmt(p)}</span>
														</>
													) : (
														<span className="font-medium">{fmt(p)}</span>
													);
												})()}
											</div>
										</div>
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default SearchBar;

