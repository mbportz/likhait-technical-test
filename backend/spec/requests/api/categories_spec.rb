require 'rails_helper'

RSpec.describe "Api::Categories", type: :request do
  describe "GET /api/categories" do
    let!(:food) { Category.create!(name: "Food") }
    let!(:transport) { Category.create!(name: "Transport") }
    let!(:supplies) { Category.create!(name: "Supplies") }

    it "returns all categories" do
      get "/api/categories"

      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json.length).to eq(3)
      expect(json.map { |c| c["name"] }).to include("Food", "Transport", "Supplies")
    end

    it "returns categories in alphabetical order" do
      get "/api/categories"

      json = JSON.parse(response.body)
      expect(json.map { |c| c["name"] }).to eq([ "Food", "Supplies", "Transport" ])
    end
  end

  describe "POST /api/categories" do
    context "with valid parameters" do
      let(:valid_params) do
        { category: { name: "Subscriptions" } }
      end

      it "creates a new category" do
        expect {
          post "/api/categories", params: valid_params, as: :json
        }.to change(Category, :count).by(1)

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json["name"]).to eq("Subscriptions")
        expect(json["id"]).to be_present
      end
    end

    context "with invalid parameters" do
      it "returns errors when name is blank" do
        expect {
          post "/api/categories", params: { category: { name: "" } }, as: :json
        }.not_to change(Category, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("Name can't be blank")
      end

      it "returns errors when name is duplicate" do
        Category.create!(name: "Food")

        expect {
          post "/api/categories", params: { category: { name: "Food" } }, as: :json
        }.not_to change(Category, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to include("Name has already been taken")
      end

      it "returns errors when name exceeds maximum length" do
        long_name = "a" * 101

        expect {
          post "/api/categories", params: { category: { name: long_name } }, as: :json
        }.not_to change(Category, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json["errors"]).to be_present
      end
    end
  end
end
