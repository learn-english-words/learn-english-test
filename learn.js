/* =========================================================
   EnglishWords — صفحة اختيار المستوى والتصنيف
   التصنيفات يتم تحميلها من Supabase
========================================================= */


/* =========================================================
   المتغيرات
========================================================= */

let selectedLevel = null;
let selectedCategory = null;


/* =========================================================
   عند تحميل الصفحة
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadCategories();

    restorePreviousSelection();

});


/* =========================================================
   تحميل التصنيفات من Supabase
========================================================= */

async function loadCategories() {

    const container =
        document.getElementById("categoriesContainer");

    const errorBox =
        document.getElementById("categoryError");


    if (!container) {
        return;
    }


    // إخفاء الخطأ

    if (errorBox) {
        errorBox.hidden = true;
    }


    // شاشة التحميل

    container.innerHTML = `
        <div class="loading-categories">

            <div class="loading-spinner"></div>

            <span>
                جاري تحميل التصنيفات...
            </span>

        </div>
    `;


    try {

        // التأكد أن Supabase موجود

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            throw new Error(
                "supabaseClient غير موجود"
            );

        }


        // جلب التصنيفات

        const { data, error } =
            await supabaseClient

                .from("categories")

                .select(
                    "id, name_ar, name_en, icon"
                )

                .order(
                    "created_at",
                    {
                        ascending: true
                    }
                );


        if (error) {

            console.error(
                "Categories error:",
                error
            );

            throw error;
        }


        console.log(
            "Categories loaded:",
            data
        );


        // لا توجد بيانات

        if (!data || data.length === 0) {

            container.innerHTML = `

                <div class="empty-categories">

                    <div class="empty-icon">
                        📂
                    </div>

                    <strong>
                        لا توجد تصنيفات
                    </strong>

                    <small>
                        لم يتم العثور على أي تصنيفات في قاعدة البيانات.
                    </small>

                </div>

            `;

            return;
        }


        // إنشاء التصنيفات

        container.innerHTML = "";


        data.forEach(function (category, index) {

            const button =
                document.createElement("button");


            button.type = "button";

            button.className =
                "category-card";


            button.dataset.categoryId =
                category.id;


            button.dataset.category =
                category.name_en || "";


            button.onclick = function () {

                selectCategory(
                    this,
                    category
                );

            };


            // الأيقونة

            const icon =
                category.icon || "📚";


            // الاسم العربي

            const nameAr =
                category.name_ar || "تصنيف";


            // الاسم الإنجليزي

            const nameEn =
                category.name_en || "";


            button.innerHTML = `

                <div class="category-icon">

                    ${escapeHtml(icon)}

                </div>


                <div class="category-info">

                    <strong>
                        ${escapeHtml(nameAr)}
                    </strong>

                    <small>
                        ${escapeHtml(nameEn)}
                    </small>

                </div>


                <span class="category-check">
                    ✓
                </span>

            `;


            container.appendChild(button);

        });


        // استرجاع التصنيف السابق

        restoreCategoryAfterLoad();


    } catch (error) {

        console.error(
            "Failed to load categories:",
            error
        );


        container.innerHTML = "";


        if (errorBox) {

            errorBox.hidden = false;

        }

    }

}


/* =========================================================
   اختيار المستوى
========================================================= */

function selectLevel(element, level) {

    // إزالة التحديد من جميع المستويات

    document
        .querySelectorAll(".level-card")
        .forEach(function (card) {

            card.classList.remove("selected");

        });


    // تحديد المستوى الحالي

    element.classList.add("selected");


    selectedLevel = level;


    // حفظ المستوى

    localStorage.setItem(
        "selectedLevel",
        level
    );


    updateStartButton();

}


/* =========================================================
   اختيار التصنيف
========================================================= */

function selectCategory(element, category) {

    // إزالة التحديد من جميع التصنيفات

    document
        .querySelectorAll(".category-card")
        .forEach(function (card) {

            card.classList.remove("selected");

        });


    // تحديد التصنيف

    element.classList.add("selected");


    /*
       نخزن اسم التصنيف الإنجليزي
       حتى يتوافق مع نظام الكلمات الحالي
    */

    selectedCategory =
        category.name_en;


    // حفظ ID التصنيف أيضًا

    if (category.id) {

        localStorage.setItem(
            "selectedCategoryId",
            category.id
        );

    }


    // حفظ التصنيف

    localStorage.setItem(
        "selectedCategory",
        selectedCategory
    );


    updateStartButton();

}


/* =========================================================
   تفعيل زر البداية
========================================================= */

function updateStartButton() {

    const button =
        document.getElementById("startBtn");


    const message =
        document.getElementById(
            "selectionMessage"
        );


    if (!button) {
        return;
    }


    if (
        selectedLevel &&
        selectedCategory
    ) {

        button.disabled = false;


        const text =
            button.querySelector(
                "span:first-child"
            );


        if (text) {

            text.textContent =
                "ابدأ التعلم 🚀";

        }


        if (message) {

            message.textContent =
                "ممتاز! جاهز لبدء التعلم 🚀";

            message.classList.add(
                "ready"
            );

        }

    } else {

        button.disabled = true;


        const text =
            button.querySelector(
                "span:first-child"
            );


        if (text) {

            text.textContent =
                "ابدأ التعلم";

        }


        if (message) {

            message.textContent =
                "اختر المستوى والتصنيف للبدء 👆";

            message.classList.remove(
                "ready"
            );

        }

    }

}


/* =========================================================
   بدء التعلم
========================================================= */

function startLearning() {

    if (
        !selectedLevel ||
        !selectedCategory
    ) {

        return;

    }


    // حفظ الاختيارات

    localStorage.setItem(
        "selectedLevel",
        selectedLevel
    );


    localStorage.setItem(
        "selectedCategory",
        selectedCategory
    );


    // الانتقال إلى صفحة الكلمات

    window.location.href =
        "words.html";

}


/* =========================================================
   استرجاع المستوى السابق
========================================================= */

function restorePreviousSelection() {

    const savedLevel =
        localStorage.getItem(
            "selectedLevel"
        );


    if (!savedLevel) {
        return;
    }


    const card =
        document.querySelector(
            `.level-card[data-level="${savedLevel}"]`
        );


    if (card) {

        selectedLevel =
            savedLevel;

        card.classList.add(
            "selected"
        );

    }


    updateStartButton();

}


/* =========================================================
   استرجاع التصنيف بعد تحميله
========================================================= */

function restoreCategoryAfterLoad() {

    const savedCategory =
        localStorage.getItem(
            "selectedCategory"
        );


    if (!savedCategory) {

        updateStartButton();

        return;

    }


    const cards =
        document.querySelectorAll(
            ".category-card"
        );


    cards.forEach(function (card) {

        const category =
            card.dataset.category;


        if (
            category &&
            category.toLowerCase() ===
            savedCategory.toLowerCase()
        ) {

            card.classList.add(
                "selected"
            );

            selectedCategory =
                category;

        }

    });


    updateStartButton();

}


/* =========================================================
   الرجوع للرئيسية
========================================================= */

function goHome() {

    window.location.href =
        "index.html";

}


/* =========================================================
   حماية النصوص القادمة من قاعدة البيانات
========================================================= */

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}