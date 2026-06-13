using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Template.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditLogIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_action",
                table: "audit_logs",
                column: "action");

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_created_by",
                table: "audit_logs",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_created_by_action_created_at",
                table: "audit_logs",
                columns: new[] { "created_by", "action", "created_at" });

            migrationBuilder.CreateIndex(
                name: "IX_audit_logs_entity_type",
                table: "audit_logs",
                column: "entity_type");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_audit_logs_action",
                table: "audit_logs");

            migrationBuilder.DropIndex(
                name: "IX_audit_logs_created_by",
                table: "audit_logs");

            migrationBuilder.DropIndex(
                name: "IX_audit_logs_created_by_action_created_at",
                table: "audit_logs");

            migrationBuilder.DropIndex(
                name: "IX_audit_logs_entity_type",
                table: "audit_logs");
        }
    }
}
