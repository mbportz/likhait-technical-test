import React, { useState, useEffect } from "react";
import {
  getExpenses,
  createExpense,
  fetchCategories,
  createCategory,
} from "../services/api";
import { Expense, ExpenseFormData, Category } from "../types";
import YearNavigation from "../components/YearNavigation";
import { MonthNavigation } from "../components/MonthNavigation";
import CategoryBreakdown from "../components/CategoryBreakdown";
import { CalendarExpenseTable } from "../components/CalendarExpenseTable";
import { AddCategoryModal } from "../components/AddCategoryModal";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { Button } from "../vibes";
import { COLORS } from "../constants/colors";

interface CategorySummary {
  category: string;
  amount: number;
  count: number;
}

const HistoryPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Get year and month from URL params, default to current date if not provided
  const getInitialYearMonth = () => {
    const params = new URLSearchParams(window.location.search);
    const currentDate = new Date();
    const yearParam = params.get("year");
    const monthParam = params.get("month");

    return {
      year: yearParam ? parseInt(yearParam) : currentDate.getFullYear(),
      month: monthParam ? parseInt(monthParam) : currentDate.getMonth() + 1,
    };
  };

  const initialYearMonth = getInitialYearMonth();
  const [selectedYear, setSelectedYear] = useState(initialYearMonth.year);
  const [selectedMonth, setSelectedMonth] = useState(initialYearMonth.month);

  // Update URL when year or month changes
  const updateURL = (year: number, month: number) => {
    const params = new URLSearchParams();
    params.set("year", year.toString());
    params.set("month", month.toString());
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newURL);
  };

  // Initialize URL params if not present
  useEffect(() => {
    updateURL(selectedYear, selectedMonth);
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  const fetchExpenseCategories = async () => {
    try {
      const categories = await fetchCategories();
      setExpenseCategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses(selectedYear, selectedMonth);
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    updateURL(year, selectedMonth);
  };

  const handleMonthChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    updateURL(year, month);
  };

  const handleAddExpense = async (data: ExpenseFormData) => {
    try {
      const category = expenseCategories.find(
        (expenseCategory) => expenseCategory.name === data.category,
      );

      if (!category) {
        throw new Error("Selected category not found");
      }

      await createExpense(data, category.id);
      setIsExpenseModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  };

  const handleAddCategory = async (name: string) => {
    await createCategory(name);
    setIsCategoryModalOpen(false);
    await fetchExpenseCategories();
  };

  // Calculate category breakdown
  const categoryBreakdownTotals = expenses.reduce<
    Record<string, CategorySummary>
  >(
    (categoryTotals: Record<string, CategorySummary>, expense: Expense) => {
      const categoryName = expense.category || "Uncategorized";
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = {
          category: categoryName,
          amount: 0,
          count: 0,
        };
      }
      categoryTotals[categoryName].amount += Number(expense.amount);
      categoryTotals[categoryName].count += 1;
      return categoryTotals;
    },
    {},
  );

  const categories = (
    Object.values(categoryBreakdownTotals) as CategorySummary[]
  ).sort(
    (firstCategory, secondCategory) =>
      secondCategory.amount - firstCategory.amount,
  );
  const total = categories.reduce(
    (sum, categorySummary) => sum + categorySummary.amount,
    0,
  );
  const totalCount = categories.reduce(
    (sum, categorySummary) => sum + categorySummary.count,
    0,
  );

  const pageStyle: React.CSSProperties = {
    padding: "48px 64px",
    minHeight: "100vh",
    background: COLORS.secondary.s01,
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    justifyContent: "space-between",
  };

  const leftHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "24px",
  };

  const headerActionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "40px",
    fontWeight: 700,
    color: COLORS.secondary.s10,
    margin: 0,
    flexShrink: 0,
  };

  const loadingStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px",
    fontSize: "18px",
    color: COLORS.secondary.s08,
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={leftHeaderStyle}>
          <h1 style={titleStyle}>Expense History</h1>
          <YearNavigation
            currentYear={selectedYear}
            onYearChange={handleYearChange}
          />
        </div>
        <div style={headerActionsStyle}>
          <Button variant="secondary" onClick={() => setIsCategoryModalOpen(true)}>
            Add Category
          </Button>
          <Button variant="primary" onClick={() => setIsExpenseModalOpen(true)}>
            Add Expense
          </Button>
        </div>
      </div>

      <MonthNavigation
        currentMonth={selectedMonth}
        currentYear={selectedYear}
        onMonthChange={handleMonthChange}
      />

      <div>
        {loading ? (
          <div style={loadingStyle}>Loading...</div>
        ) : (
          <>
            <CategoryBreakdown
              categories={categories}
              total={total}
              totalCount={totalCount}
            />
            <div style={{ marginTop: "32px" }}>
              <CalendarExpenseTable
                expenses={expenses}
                categories={expenseCategories}
                onExpenseUpdated={fetchExpenses}
              />
            </div>
          </>
        )}
      </div>

      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        categories={expenseCategories}
        onSubmit={handleAddExpense}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSubmit={handleAddCategory}
      />
    </div>
  );
};

export default HistoryPage;
