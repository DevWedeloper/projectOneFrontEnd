import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GuildStatsComponent } from './features/guild-stats/guild-stats.component';
import { CharacterStatsComponent } from './features/character-stats/character-stats.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CharacterStatsComponent, GuildStatsComponent]
})
export class DashboardComponent {

}
