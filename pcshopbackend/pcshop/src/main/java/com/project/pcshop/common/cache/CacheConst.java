package com.project.pcshop.common.cache;


public class CacheConst {
    public static final long DEFAULT_TTL = 24;
    public static final long PRODUCT_LIST_TLL = 10;
    public static final long PRODUCT_TLL = 10;
    public static final long PRODUCT_IMAGE_TLL = 120;

    public static final String CATEGORY_ALL = "category:all";
    public static final String BRAND_ALL = "brand:all";

    public static final String PRODUCT_ALL_PREFIX = "product:all";
    public static final String PRODUCT_BY_CATEGORY_PREFIX = "product:category";
    public static final String PRODUCT_BY_BRAND_PREFIX = "product:brand";
    public static final String PRODUCT_DETAIL_PREFIX = "product";
    public static final String PRODUCT_IMAGE_PREFIX = "product:image";

    public static String productKey(
            Long id
    ) {
        return PRODUCT_DETAIL_PREFIX + ":" + id;
    }

    public static String productAllKey(
            Integer page,
            Integer limit,
            String sort,
            String searchKey
    ) {
        return String.format(
                "%s:page=%d:limit=%d:sort=%s:q=%s",
                PRODUCT_ALL_PREFIX,
                page,
                limit,
                sort != null ? sort.trim().toLowerCase() : "default",
                (searchKey != null && !searchKey.isBlank()) ? searchKey.trim().toLowerCase() : "all"
        );
    }

    public static String productCategoryKey(
            Integer page,
            Integer limit,
            String sort,
            Long categoryId
    ) {
        return String.format(
                "%s:%d:page=%d,limit=%d:sort=%s",
                PRODUCT_BY_CATEGORY_PREFIX,
                categoryId,
                page,
                limit,
                sort != null ? sort.trim().toLowerCase() : "default"
        );
    }

    public static String productBrandKey(
            Integer page,
            Integer limit,
            String sort,
            Long brandId
    ) {
        return String.format(
                "%s:%d:page=%d,limit=%d:sort=%s",
                PRODUCT_BY_BRAND_PREFIX,
                brandId,
                page,
                limit,
                sort != null ? sort.trim().toLowerCase() : "default"
        );
    }

    public static String productImageKey(
            Long productId
    ) {
        return PRODUCT_IMAGE_PREFIX + ":" + productId;
    }

}
