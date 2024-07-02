<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderItemTable extends Migration
{
    public function up()
    {
        Schema::create('order_item', function (Blueprint $table) {
            $table->id('order_item_id')->unsigned();
            $table->unsignedInteger('order_detail_id');
            $table->unsignedInteger('product_id');
            $table->unsignedInteger('quantity');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_item');
    }
}
