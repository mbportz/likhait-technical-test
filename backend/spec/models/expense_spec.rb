require 'rails_helper'

RSpec.describe Expense, type: :model do
  let(:category) { Category.create!(name: "Food") }

  it "is valid with valid attributes" do
    expense = Expense.new(
      description: "Lunch",
      amount: 25.50,
      category: category,
      date: Date.today
    )

    expect(expense).to be_valid
  end

  it "requires a description" do
    expense = Expense.new(
      description: "",
      amount: 25.50,
      category: category,
      date: Date.today
    )

    expect(expense).not_to be_valid
    expect(expense.errors[:description]).to include("can't be blank")
  end

  it "requires a positive amount" do
    expense = Expense.new(
      description: "Lunch",
      amount: -10,
      category: category,
      date: Date.today
    )

    expect(expense).not_to be_valid
    expect(expense.errors[:amount]).to include("must be greater than 0")
  end

  it "requires a date" do
    expense = Expense.new(
      description: "Lunch",
      amount: 25.50,
      category: category,
      date: nil
    )

    expect(expense).not_to be_valid
    expect(expense.errors[:date]).to include("can't be blank")
  end
end
